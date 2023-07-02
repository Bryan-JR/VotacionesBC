import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser"
import { Route } from "./routes/Routes.js";

//import { DAO } from "./models/DAO.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));


// app.get('/', (req, res) => {
//     DAO.all((err, users) => {
//       if (err) {
//         console.error('Error al obtener los usuarios:', err);
//         res.status(500).json({ error: 'Error al obtener los usuarios' });
//       }
//         res.send(users);
//         console.log("Entro aquí");
//     });
// });

app.use(Route);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("Servidor ejecutandose en: http://localhost:"+port);
});