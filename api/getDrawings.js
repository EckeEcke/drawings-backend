const { getDrawings } = require('./index')

module.exports = async (req, res) => {
  await getDrawings(req, res)
}