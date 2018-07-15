UPDATE dbo.AspNetUserRoles
SET
	RoleId = (SELECT Sub_Roles.Id FROM dbo.AspNetRoles AS Sub_Roles WHERE Sub_Roles.Name = 'Admin')
FROM
	dbo.AspNetUserRoles AS UserRoles

	INNER JOIN dbo.AspNetUsers AS Users ON
		Users.Id = UserRoles.UserId
WHERE
	Users.UserName IN ('mihaly.tringel.toptal@gmail.com', 'vanja.vidovic@toptal.com')
