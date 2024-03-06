const middlewares = require('../middlewares')
const projectsInitialized = []

module.exports.ioHandler = (io, project = 'chat') => {
    console.log('Attempting to initialize project ', project)

    if (projectsInitialized.includes(project))
        return null;

    io.engine.use((req, res, next) => {
        const isHandshake = req._query.sid === undefined;

        if (!isHandshake) {
            return next();
        }
        middlewares.auth.authenticate(req, res, next)
    });
    io.of(`/${project}`).on('connection', require('../controllers').socket(io, project))
    projectsInitialized.push(project)
}