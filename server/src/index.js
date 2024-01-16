import server from "./server.js";

const main=() => {
    server.listen(3000, () => {
        console.log(`Server on port 3000`);
    });
};

main();