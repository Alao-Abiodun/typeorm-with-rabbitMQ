import { AppDataSource } from "./index"
import { Product } from "./entity/product"
import * as express from "express";
import { Request, Response } from 'express';
import * as cors from "cors";

AppDataSource.initialize().then(async () => {

    const productRepository = AppDataSource.getRepository(Product);


    const app = express();

    app.use(express.json());

    app.use(cors({
        origin:
            ["http://localhost:3000", "http://localhost:3001"]
    }
    ));

    app.get("/products", async (req: Request, res: Response) => {
        const allProducts = await productRepository.find();
        res.send(allProducts);
    });

    app.post("/products", async (req: Request, res: Response) => {
        const product = new Product();
        product.title = req.body.title;
        product.image = req.body.image;
        product.likes = req.body.likes;

        await productRepository.save(product);
        res.send(product);
    }
    );

    app.put("/products/:id", async (req: Request, res: Response) => {
        const product = await productRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!product) {
            res.status(404).send("Product not found");
            return;
        }
        product.title = req.body.title;
        product.image = req.body.image;
        product.likes = req.body.likes;
        await productRepository.save(product);
        res.send(product);
    }
    );

    app.delete("/products/:id", async (req: Request, res: Response) => {
        const product = await productRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!product) {
            res.status(404).send({ message: "Product not found" });
            return;
        }
        await productRepository.remove(product);
        res.send(product);
    }
    );


    app.listen(8000);

    console.log("Server is running on port 8000...")


}).catch(error => console.log(error))
