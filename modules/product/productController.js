const Product = require("./ProductModel");

const createProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            title: req.body.title,
            image: req.body.image,
            storeId: req.body.storeId,
            storeName: req.body.storeName,
            price: req.body.price,
            discount: req.body.discount,
            features: req.body.features,
            parent: req.body.parent,
            parentSlug: req.body.parent.replaceAll(" ", "-").toLowerCase(),
            children: req.body.children,
            childrenSlug: req.body.children.replaceAll(" ", "-").toLowerCase(),
            titleSlug: req.body.title.replaceAll(" ", "-").toLowerCase(),
            description: req.body.description,
        })
        const result = await newProduct.save()
        res.status(400).json({
            status: "success",
            message: "Product Added Successfull",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Data couldn't insert",
            error: error.message,
        });
    }
}



const getShowingProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: "Show" }).sort({ _id: -1 });
        res.send(products);
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

const getDiscountedProducts = async (req, res) => {
    try {
        const products = await Product.find({ discount: { $gt: 5 } }).sort({
            _id: -1,
        });

        console.log("prod", products);
        res.send(products);
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ _id: -1 });
        res.send(products);
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};



const getStockOutProducts = async (req, res) => {
    try {
        const products = await Product.find({ quantity: { $lt: 1 } }).sort({
            _id: -1,
        });

        res.send(products);
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.find({ parent: req.params.slug });
        res.send([product]);
    } catch (err) {
        res.status(500).send({
            message: `Slug problem, ${err.message}`,
        });
    }
};


const getProductsByParent = async (req, res) => {
    console.log("Params for slug: ", req.params?.slug);
    try {
        const products = await Product.find({ slug: req.params?.slug });

        res.status(200).send(products);
    } catch (err) {
        res.status(500).send({
            message: `Slug problem, ${err.message}`,
        });
    }
};

// get product by slug and children_slug
const getProductsBySlugAndChildrenSlug = async (req, res) => {
    const { slug, children_slug } = req.params
    console.log(children_slug);
    try {
        const products = await Product.find({ status: "Show", slug: slug, children_slug: children_slug });

        res.status(200).send(products);
    } catch (err) {
        res.status(500).send({
            message: `Slug problem, ${err.message}`,
        });
    }
};


const getProductById = async (req, res) => {
    console.log(req.params.id);
    try {
        const product = await Product.findById(req.params.id);
        // console.log(product);
        res.send(product);
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.sku = req.body.sku;
            product.title = req.body.title;
            product.slug = req.body.slug;
            product.description = req.body.description;
            product.parent = req.body.parent;
            product.children = req.body.children;
            product.type = req.body.type;
            product.unit = req.body.unit;
            product.quantity = req.body.quantity;
            product.originalPrice = req.body.originalPrice;
            product.price = req.body.price;
            product.discount = req.body.discount;
            product.images = req.body.images;
            product.tag = req.body.tag;
            product.storeName = req.body.storeName;
            await product.save();
            res.send({ data: product, message: "Product updated successfully!" });
        }
        // handleProductStock(product);
    } catch (err) {
        res.status(404).send(err.message);
    }
};

const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error("Product already reviewed");
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();

        res.status(201).json({
            message: "Review Added",
        });
    }
    else {
        res.status(404);
        throw new Error("Product not found");
    }
};

const updateStatus = async (req, res) => {
    const newStatus = req.body.status;
    console.log(newStatus);

    try {

        const findProduct = await Product.findById({ _id: req.params.id })
        if (findProduct) {
            const result = await Product.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        status: newStatus,
                    },
                },
            )
            res.status(200).send({
                message: `Product ${newStatus} Successfully!`,
            });
        }
        else {
            res.status(500).send({
                message: "Product Not Found",
            });
        }

    }
    catch (error) {
        res.status(500).send({
            message: err.message,
        });
    }

};

const deleteProduct = async (req, res) => {
    // console.log(req.params.id);

    try {
        const findProduct = await Product.findById({ _id: req.params.id })
        if (findProduct) {
            const result = await Product.deleteOne({ _id: req.params.id })
            res.status(200).send({
                message: "Product Deleted Successfully!",
                status: 200,
            });
        }
        else {
            res.status(500).send({
                message: "Product Not Found",
            });
        }
    }
    catch (error) {
        res.status(500).send({
            message: err.message,
        });
    }

};


const getLatestProducts = async (req, res) => {
    try {
        const result = await Product.find({ status: "Show" }).skip(0).limit(20).sort({ _id: -1 })
        res.status(200).send(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


// @access Public.
const getSearchProducts = async (req, res) => {
    const searchKey = req.params.searchtitle.toLowerCase();
    const product = await Product.find({});

    const allSearchedProducts = product.filter((i) => {
        const mainname = i.title.toLowerCase();
        return mainname.includes(searchKey) && i;
    });
    console.log(allSearchedProducts);

    if (product) {
        res.status(200).json({ total: product.length, allSearchedProducts });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
};



// get all products by role
const getAllProductsByRole = async (req, res) => {
    try {
        const { _id } = req.user
        const isAdmin = await Admin.findById({ _id: _id })
        const isSeller = await User.findById({ _id: _id })

        // console.log(isAdmin, isSeller, _id);

        if (isAdmin && isAdmin?.role === "admin") {
            const products = await Product.find({}).sort({ _id: -1 });
            res.send(products);
        }
        else if (isSeller && isSeller?.role === "seller") {
            const products = await Product.find({ sellerId: _id }).sort({ _id: -1 });
            res.send(products);
        }
        else {
            res.status(500).send({
                message: "User Not Valid",
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

// handle function call to updated property
// async function addProperty() {
//     try {
//         const result = await Store.updateMany({}, { userId: "640c586a9d959d1d04ea94b5" });
//         console.log(`${result.nModified} products updated`);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         // close the database connection
//         await mongoose.connection.close();
//     }
// }


module.exports = {
    createProduct,
    getAllProducts,
    getShowingProducts,
    getDiscountedProducts,
    getStockOutProducts,
    getProductById,
    getProductBySlug,
    updateProduct,
    updateStatus,
    deleteProduct,
    getProductsByParent,
    getSearchProducts,
    getLatestProducts,

    getProductsBySlugAndChildrenSlug,

    // ---------------dashboard ----------------
    getAllProductsByRole,
}