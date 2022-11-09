

module.exports = {
    home: (req, res) => {
        res.render('admin/adminHome')
    },

    productList: (req, res) => {
        res.render('admin/adminProduct')
    }
}