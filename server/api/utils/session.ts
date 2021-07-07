import mongoose from "mongoose";

const sessionHandler = async (operation) => {
    const session = await mongoose.startSession();
    let res = null;
    try {
        await session.withTransaction(async () => {
            res = await operation(session);
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
    session.endSession();
    return res;
};

export { sessionHandler };
