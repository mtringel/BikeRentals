using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using System.Data;
using System;
using Toptal.BikeRentals.CallContext;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using System.Data.Common;
using Toptal.BikeRentals.Exceptions.DataAccess;

namespace Toptal.BikeRentals.DataAccess.Helpers
{
    /// <summary>
    /// Lifetime: Transient
    /// Do not add public instance methods here.
    /// </summary>
    public abstract class DataProviderBase
    {
        public const string InvalidCharsInFieldNames = "[]{}<>;:\"'";

        public DataProviderBase(ICallContext callContext, AppDbContext appDbContext)
        {
            this.AppDbContext = appDbContext;
        }

        #region Services

        protected AppDbContext AppDbContext { get; private set; }

        protected ICallContext CallContext { get; private set; }

        #endregion

        protected void RequireTransaction(string operation)
        {
            if (!AppDbContext.IsInTransaction)
                throw new TransactionRequiredException(this.GetType(), operation);
        }

        protected ITransactionScope EnsureTransaction()
        {
            return AppDbContext.BeginTransaction();
        }

        protected void Add<T>(DbSet<T> set, T entity) where T : Entity
        {
            set.Add(entity);
            AppDbContext.Entry(entity).State = EntityState.Added;
        }

        /// <summary>
        /// Call for modified entities not registered in DbContext.
        /// To updated entities got from DbContext, no need to call it.
        /// </summary>
        protected void Update<T>(DbSet<T> set, T entity) where T : Entity
        {
            set.Update(entity);
            AppDbContext.Entry(entity).State = EntityState.Modified;
        }

        protected void Save<T>(DbSet<T> set, T entity) where T : Entity
        {
            if (set.Find(entity.Keys()) == null)
                Add(set, entity);
            else
                Update(set, entity);
        }


        protected DbConnection EnsureConnectionIsOpen()
        {
            var connection = AppDbContext.Database.GetDbConnection();

            if (connection.State == ConnectionState.Broken || connection.State == ConnectionState.Closed)
                connection.Open();

            return connection;
        }

        /// <summary>
        /// Detach entities, if you don't want them to be tracked (for saving with the DataProvider, like Users, which are saved calling ASP.Net Identity)
        /// </summary>
        protected T Detach<T>(T entity) where T : Entity
        {
            if (entity != null)
                AppDbContext.Entry(entity).State = EntityState.Detached;

            return entity;
        }

        /// <summary>
        /// Detach entities, if you don't want them to be tracked (for saving with the DataProvider, like Users, which are saved calling ASP.Net Identity)
        /// </summary>
        protected IQueryable<T> Detach<T>(IQueryable<T> entities) where T: Entity
        {
            foreach (var entity in entities)
                Detach(entity);

            return entities;
        }

        #region Delete

        /// <summary>
        /// Detach all loaded entities!
        /// </summary>
        protected void DeleteAll<T>(DbSet<T> set, string tableName) where T : Entity
        {
            // Delete from database
            // use string instead of FormattableString, otherwise parameters will be generated
            AppDbContext.Database.ExecuteSqlCommand((string)$"DELETE FROM [dbo].[{tableName}]");

            // Detach from DbContext
            foreach (var entity in AppDbContext.ChangeTracker.Entries<T>().ToArray())
                entity.State = EntityState.Detached;
        }

        /// <summary>
        /// At least one parameter must be specified
        /// Detach loaded entities!
        /// </summary>
        protected void Delete<T>(
            DbSet<T> set,
            Func<T, bool> predicate,
            string tableName,
            IEnumerable<KeyValuePair<string, object>> fieldFilter
            )
            where T : Entity
        {
            #region Delete from database

            var parameters =
                (fieldFilter ?? Enumerable.Empty<KeyValuePair<string, object>>())
                .Select(t => CreateParameterDynamic(t.Key, t.Value))
                .ToArray();

            EnsureConnectionIsOpen();

            string sql = string.Format(
                "DELETE FROM [dbo].[{0}] WHERE {1}",
                tableName,
                String.Join(" AND ", parameters.Select(t => $"[{t.ParameterName}]=@{t.ParameterName}"))
                );

            AppDbContext.Database.ExecuteSqlCommand(sql, parameters);

            #endregion

            #region Detach from DbContext

            foreach (var entry in AppDbContext.ChangeTracker.Entries<T>().Where(t => predicate(t.Entity)).ToArray())
                entry.State = EntityState.Detached;

            #endregion
        }

        /// <summary>
        /// At least one parameter must be specified
        /// Detach loaded entities!
        /// </summary>
        protected void DeleteByReferredTable<T>(
            DbSet<T> set,
            Func<T, bool> predicate,
            string tableName,
            IEnumerable<KeyValuePair<string, object>> tableFilter,
            string tableForeignKey,
            string referredTableName,
            string referredTablePrimaryKey,
            IEnumerable<KeyValuePair<string, object>> referredTableFilter
            )
            where T : Entity
        {
            #region Delete from database

            var parameters =
                // table
                (tableFilter ?? Enumerable.Empty<KeyValuePair<string, object>>())
                .Select(t => new KeyValuePair<string, DbParameter>($"Main.[{t.Key}]", CreateParameterDynamic($"Main_{t.Key}", t.Value)))
                // referred table
                .Concat(
                (referredTableFilter ?? Enumerable.Empty<KeyValuePair<string, object>>())
                .Select(t => new KeyValuePair<string, DbParameter>($"Referred.[{t.Key}]", CreateParameterDynamic($"Referred_{t.Key}", t.Value)))
                )
                .ToArray();

            EnsureConnectionIsOpen();

            string sql = string.Format(
                "DELETE FROM Main FROM [dbo].[{0}] AS Main INNER JOIN [dbo].[{1}] AS Referred ON Main.[{2}] = Referred.[{3}] WHERE {4}",
                tableName,
                referredTableName,
                tableForeignKey,
                referredTablePrimaryKey,
                String.Join(" AND ", parameters.Select(t => $"{t.Key}=@{t.Value.ParameterName}"))
                );

            AppDbContext.Database.ExecuteSqlCommand(sql, parameters.Select(t => t.Value).ToArray());

            #endregion

            #region Detach from DbContext

            foreach (var entry in AppDbContext.ChangeTracker.Entries<T>().Where(t => predicate(t.Entity)).ToArray())
                entry.State = EntityState.Detached;

            #endregion
        }

        #endregion

        /// <summary>
        /// Will throw error if entity is in Added, Deleted or Detached state. Must be saved before otherwise cannot be reloaded.
        /// </summary>
        public void Reload<T>(T entity, bool throwErrorIfNotRefreshable) where T : Entity
        {
            var entry = AppDbContext.Entry(entity);

            if (entry.State != EntityState.Unchanged && entry.State != EntityState.Modified)
            {
                if (throwErrorIfNotRefreshable)
                    throw new NotSupportedException($"Reload is not supported for entity state '{entry.State}' for entity '{entity.GetType().FullName}' with keys {{{String.Join(",", entity.Keys())}}}.");
                else
                    return;
            }

            entry.State = EntityState.Modified;
            AppDbContext.Entry(entity).Reload();
        }

        #region Parameters

        protected static SqlParameter CreateParameterDynamic(string name, object value)
        {
            if (value == null || value is DBNull)
                return CreateParameter(name, (string)null);
            else if (value is string)
                return CreateParameter(name, (string)value);
            else if (value is int)
                return CreateParameter(name, (int)value);
            else if (value is int?)
                return CreateParameter(name, (int?)value);
            else if (value is bool)
                return CreateParameter(name, (bool)value);
            else if (value is bool?)
                return CreateParameter(name, (bool?)value);
            else if (value is DateTime)
                return CreateParameter(name, (DateTime)value);
            else if (value is DateTime?)
                return CreateParameter(name, (DateTime?)value);
            else if (value is Guid)
                return CreateParameter(name, (Guid)value);
            else if (value is Guid?)
                return CreateParameter(name, (Guid?)value);
            else
                throw new NotSupportedException($"Argument type {value.GetType().FullName} is not supported for parameter value {value}.");
        }

        protected static SqlParameter CreateParameter(string name, int? value)
        {
            return new SqlParameter(name, SqlDbType.Int) { Value = value.HasValue ? (object)value : DBNull.Value };
        }

        protected static SqlParameter CreateParameter(string name, int value)
        {
            return new SqlParameter(name, SqlDbType.Int) { Value = value };
        }

        protected static SqlParameter CreateParameter(string name, DateTime? value)
        {
            return new SqlParameter(name, SqlDbType.DateTime) { Value = value.HasValue ? (object)value : DBNull.Value };
        }

        protected static SqlParameter CreateParameter(string name, DateTime value)
        {
            return new SqlParameter(name, SqlDbType.DateTime) { Value = value };
        }

        protected static SqlParameter CreateParameter(string name, string value)
        {
            if (string.IsNullOrEmpty(value))
                return new SqlParameter(name, SqlDbType.NVarChar, 1) { Value = DBNull.Value };
            else
                return new SqlParameter(name, SqlDbType.NVarChar, value.Length) { Value = value };
        }

        protected static SqlParameter CreateParameter(string name, bool? value)
        {
            return new SqlParameter(name, SqlDbType.Bit) { Value = value.HasValue ? (object)value : DBNull.Value }; ;
        }

        protected static SqlParameter CreateParameter(string name, bool value)
        {
            return new SqlParameter(name, SqlDbType.Bit) { Value = value };
        }

        protected static SqlParameter CreateParameter(string name, Guid value)
        {
            return new SqlParameter(name, SqlDbType.UniqueIdentifier) { Value = value };
        }

        protected static SqlParameter CreateParameter(string name, Guid? value)
        {
            return new SqlParameter(name, SqlDbType.UniqueIdentifier) { Value = value.HasValue ? (object)value : DBNull.Value };
        }

        protected static SqlParameter CreateOutputParameter(string name, SqlDbType type)
        {
            return new SqlParameter(name, type) { Direction = ParameterDirection.Output };
        }

        #endregion

        #region Field Names

        /// <summary>
        /// Avoid SQL injection attacks when using Linq.Dynamic for sorting.
        /// Linq.Dynamic uses square brackets to enclose fieldnames.
        /// </summary>
        public static string FormatFieldName(string fieldName)
        {
            return new String(fieldName.Where(t => !InvalidCharsInFieldNames.Contains(t)).ToArray());
        }

        /// <summary>
        /// Avoid SQL injection attacks when using Linq.Dynamic for sorting.
        /// Linq.Dynamic uses square brackets to enclose fieldnames.
        /// </summary>
        public static IEnumerable<string> FormatFieldNames(IEnumerable<string>  fieldNames)
        {
            return fieldNames.Select(t => FormatFieldName(t));
        }

        #endregion
    }
}
