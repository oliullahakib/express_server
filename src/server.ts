import { dbinit } from "./db";
import app from "./app"
import config from "./config";
const main =()=>{
dbinit()

app.listen(config.port, () => {
  console.log(`server running on port ${config.port}`);
});
}
main()