import { AppDataSource } from "./data-source";

async function getDataSource() {
    try {
        if(!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    } catch (error) {
        console.log('AppDataSource.initialize', error);
    }
    return AppDataSource;
}

export default getDataSource;
