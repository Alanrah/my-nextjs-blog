import { AppDataSource } from "./data-source"

async function getDataSource() {
    try {
        await AppDataSource.initialize();
    } catch (error) {
        console.log(error);
    }
    return AppDataSource;
}

export default getDataSource;
