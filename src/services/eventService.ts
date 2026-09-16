import { AppDataSource } from "../data_source";
import { Event } from "../entities/Event";

const eventService = {
    getAll: async () => {
        const eventRepository = AppDataSource.getRepository(Event);
        return await eventRepository.find();
    },

    getOne: async (eventId: string) => {
        const eventRepository = AppDataSource.getRepository(Event);
        return await eventRepository.findOneBy({ id: eventId });
    },
};

export default eventService;
