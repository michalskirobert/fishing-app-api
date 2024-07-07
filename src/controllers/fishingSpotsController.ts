import { Request, Response } from "express";
import { connectDatabase } from "@config/database";
import {
  FishingSpotProps,
  ParsedFishingSpotsProps,
} from "@namespace/fishing-spots";

import { Collection, CollectionInfo } from "mongodb";

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

    const collections: (CollectionInfo | Pick<CollectionInfo, "name">)[] =
      await db.listCollections().toArray();

    const allData: ParsedFishingSpotsProps = {};
    for (const collectionInfo of collections) {
      const collection: Collection<FishingSpotProps> | undefined =
        db.collection<FishingSpotProps>(collectionInfo.name);
      const documents: FishingSpotProps[] = await collection.find().toArray();
      allData[collectionInfo.name] = documents;
    }

    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching fishing spots:", error);
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

export const createFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const db = await connectDatabase("spots");

  if (!req.body) {
    res
      .status(400)
      .json({ message: 'Brak danych w żądaniu o parametrze "body"' });
    return;
  }

  try {
    const requestBody: FishingSpotProps = req.body;

    const collection = db?.collection(requestBody.area);

    const uploadedData = await collection?.insertOne(requestBody);

    res.status(200).json({ _id: uploadedData?.insertedId, requestBody });
  } catch (error) {
    res.status(500).json({
      message:
        "Wystąpił błąd podczas przesyłania danych, proszę spróbować później",
    });
  }
};

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
