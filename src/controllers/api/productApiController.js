const fs = require("fs");
const path = require("path");
const paginate = require('sequelize-paginate');
const db = require('../../database/models')

module.exports = {
  list: async (req, res) => {

    try {
      const products = await db.Product.findAll({ include: ['category'] })
      const categories = await db.Category.findAll({ include: ['products'] })

      const countByCategory = categories.reduce((obj, category) => {
        obj[category.name] = category.products.length
        return obj
      }, {})

      const productosListados = products.map((product) => {
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category.name,
          detailUrl: 'http://localhost:3000/api/products/' + product.id
        }
      })
      let respuesta = {
        meta: {
          status: 200,
          total: products.length,
          countByCategory,
          url: 'api/products',
          products: productosListados
        },
      };
      res.json(respuesta);

    } catch (error) {
      console.log(error)
    }
  },

  detail: async (req, res) => {
    const product = await db.Product.findByPk(req.params.id, {
      include: ['images', 'category']
    })
    try {
      const arrayImages = product.images.map(image => {
        return `http://localhost:3000/Images/products/${image.name}`
      });
      let producto = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        images: arrayImages,
        category: product.category.name,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }

      let respuesta = {
        meta: {
          status: 200,
          total: product.length,
          url: '/api/actor/:id'
        },
        data: producto
      }
      res.json(respuesta);
    } catch (error) {

      console.log(error);
    }

  },
  /* Para la funcion create, se espera por body: name, price, description, discount, categoryId, visible e images, donde images es un array de hasta 3 imagenes. */
  create: async (req, res) => {
    try {
      const { name, price, description, discount, categoryId, visible } =
        req.body;

      const product = await db.Product.create({
        name: name.trim(),
        price,
        description: description.trim(),
        discount,
        categoryId: categoryId,
        visible: visible
      });


      req.files.forEach(async (image) => {
        await db.Image.create({
          name: image.filename,
          productId: product.id,
        });
      });
      var finalProduct = {
        status: 200,
        url: "http://localhost:3000/api/products/" + id,
        productData: {
          id : product.id,
          name: product.dataValues.name,
          price: +product.dataValues.price,
          discount: +product.dataValues.discount,
          finalPrice: product.dataValues.price - (product.dataValues.discount / 100) * product.dataValues.price,
          description: product.dataValues.description,
          categoryId: product.dataValues.categoryId,
          images: req.files.map((file, index) => {
            return images = {
              position: index,
              filename: file.filename,
              location: `http://localhost:3000/Images/products/${file.filename}`
            };
          })

        },
      };


      console.log(finalProduct);
      return res.json({ finalProduct });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  update: async (req, res) => {
    const id = +req.params.id
    const removeImagesBefore = true
    const { name, description, discount, price, categoryId, visible } = req.body;
    try {
      const product = await db.Product.findByPk(id, { include: ['images'] })

      product.name = name.trim();
      product.price = +price;
      product.description = description.trim();
      product.discount = +discount;
      product.categoryId = categoryId;
      product.visible = visible;

      await product.save()

      if (req.files) {

        const images = req.files.map(image => {
          return {
            name: image.filename,
            productId: id
          }
        })

        if (removeImagesBefore) {

          product.images.forEach(image => {
            if (/_products_/.test(image.name)) {

              fs.existsSync(path.join(__dirname, `../../../public/images/products/${image.name}`)) &&
                fs.unlinkSync(path.join(__dirname, `../../../public/images/products/${image.name}`))
            }
          })

          db.Image.destroy({
            where: { productId: id }
          })
        }

        db.Image.bulkCreate(images)
      }

      return res.status(201).json({
        Details: "http://localhost:3000/api/products/" + id,
      });
    } catch (error) {
      console.log(error)
    }

  },
  remove: async (req,res)=>{
    const id = +req.params.id
    try {
      await db.Image.destroy({ where: { productId: id } });
      await db.Product.destroy({ where: { id: id } });
      return res.status(200).json({ message: 'Elimination successful' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

}

