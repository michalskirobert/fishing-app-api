import { Request, Response } from "express";
import { connectDatabase } from "@config/database";

export const getAllFishingSpots = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase("spots");

    if (!db) {
      res.status(404).json({ message: "Brak listy łowisk w bazie danych" });
      return;
    }

    const collections = await db?.listCollections().toArray();

    const allData: { [key: string]: any[] } = {};
    for (const collectionInfo of collections) {
      const collection = db?.collection(collectionInfo.name);
      const documents = await collection.find().toArray();
      allData[collectionInfo.name] = documents;
    }

    res.status(200).json(allData);
  } catch (error) {
    res.status(500).json({
      message: "Ogólny błąd serwera. Proszę skontaktować się z administratorem",
    });
  }
};

// export const getFishingSpotById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { id } = req.params;

//   try {
//     const spot = await fishingSpotService.getFishingSpotById(id);
//     if (!spot) {
//       res.status(404).json({ message: "Fishing spot not found" });
//       return;
//     }
//     res.json(spot);
//   } catch (error) {
//     res.status(404).json({
//       message: `Nie znaleziono danego łowiska o identyfikatorze ${req.params.id}`,
//     });
//   }
// };

// export const createFishingSpot = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { name, location } = req.body;

//   try {
//     const newSpot = await fishingSpotService.createFishingSpot(name, location);
//     res.status(201).json(newSpot);
//   } catch (error) {
//     console.error("Error creating fishing spot:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// export const updateFishingSpot = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { id } = req.params;
//   const { name, location } = req.body;

//   try {
//     const updatedSpot = await fishingSpotService.updateFishingSpot(
//       id,
//       name,
//       location
//     );
//     if (!updatedSpot) {
//       res.status(404).json({ message: "Fishing spot not found" });
//       return;
//     }
//     res.json(updatedSpot);
//   } catch (error) {
//     console.error("Error updating fishing spot:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// export const deleteFishingSpot = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { id } = req.params;

//   try {
//     await fishingSpotService.deleteFishingSpot(id);
//     res.status(204).end();
//   } catch (error) {
//     console.error("Error deleting fishing spot:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
