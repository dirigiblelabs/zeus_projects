/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var projectsDaoExtensionsUtils = require('zeus/projects/projectsDaoExtensionUtils');
var user = require("net/http/user");

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO ZEUS_PROJECTS (PROJECT_ID,PROJECT_NAME,PROJECT_SOURCE_REPOSITORY,PROJECT_ISSUES,PROJECT_TASKS,PROJECT_DOCUMENTATION,PROJECT_SOL_ID,PROJECT_CREATED_AT,PROJECT_CREATED_BY) VALUES (?,?,?,?,?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('ZEUS_PROJECTS_PROJECT_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.project_name);
        statement.setString(++i, entity.project_source_repository);
        statement.setString(++i, entity.project_issues);
        statement.setString(++i, entity.project_tasks);
        statement.setString(++i, entity.project_documentation);
        statement.setInt(++i, entity.project_sol_id);
        statement.setTimestamp(++i, new Date());
        statement.setString(++i, user.getName());
		projectsDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        projectsDaoExtensionsUtils.afterCreate(connection, entity);
    	return id;
    } finally {
        connection.close();
    }
};

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM ZEUS_PROJECTS WHERE PROJECT_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM ZEUS_PROJECTS';
        if (sort !== null) {
            sql += ' ORDER BY ' + sort;
        }
        if (sort !== null && desc !== null) {
            sql += ' DESC ';
        }
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
        connection.close();
    }
    return result;
};

// Update an entity by Id
exports.update = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'UPDATE ZEUS_PROJECTS SET PROJECT_NAME = ?,PROJECT_SOURCE_REPOSITORY = ?,PROJECT_ISSUES = ?,PROJECT_TASKS = ?,PROJECT_DOCUMENTATION = ?,PROJECT_SOL_ID = ? WHERE PROJECT_ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.project_name);
        statement.setString(++i, entity.project_source_repository);
        statement.setString(++i, entity.project_issues);
        statement.setString(++i, entity.project_tasks);
        statement.setString(++i, entity.project_documentation);
        statement.setInt(++i, entity.project_sol_id);
        var id = entity.project_id;
        statement.setInt(++i, id);
		projectsDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        projectsDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM ZEUS_PROJECTS WHERE PROJECT_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.project_id);
        projectsDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        projectsDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_PROJECTS';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } finally {
        connection.close();
    }
    return count;
};

// Returns the metadata for the entity
exports.metadata = function() {
	var metadata = {
		name: 'zeus_projects',
		type: 'object',
		properties: [
		{
			name: 'project_id',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'project_name',
			type: 'string'
		},
		{
			name: 'project_source_repository',
			type: 'string'
		},
		{
			name: 'project_issues',
			type: 'string'
		},
		{
			name: 'project_tasks',
			type: 'string'
		},
		{
			name: 'project_documentation',
			type: 'string'
		},
		{
			name: 'project_sol_id',
			type: 'integer'
		},
		{
			name: 'project_created_at',
			type: 'timestamp'
		},
		{
			name: 'project_created_by',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.project_id = resultSet.getInt('PROJECT_ID');
    result.project_name = resultSet.getString('PROJECT_NAME');
    result.project_source_repository = resultSet.getString('PROJECT_SOURCE_REPOSITORY');
    result.project_issues = resultSet.getString('PROJECT_ISSUES');
    result.project_tasks = resultSet.getString('PROJECT_TASKS');
    result.project_documentation = resultSet.getString('PROJECT_DOCUMENTATION');
	result.project_sol_id = resultSet.getInt('PROJECT_SOL_ID');
    if (resultSet.getTimestamp('PROJECT_CREATED_AT') !== null) {
        result.project_created_at = new Date(resultSet.getTimestamp('PROJECT_CREATED_AT').getTime());
    } else {
        result.project_created_at = null;
    }
    result.project_created_by = resultSet.getString('PROJECT_CREATED_BY');
    return result;
}

