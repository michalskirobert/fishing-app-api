import { Request, Response } from "express";
import { connectDatabase } from "@config/database";
import {
  FishingSpotProps,
  ParsedFishingSpotsProps,
} from "@namespace/fishing-spots";

import { Collection, CollectionInfo, ObjectId } from "mongodb";

const baseDatabaseName = "spots";

export const getAllFishingSpots = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseDatabaseName);

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

export const getFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase("spots");

    if (!db) {
      res
        .status(404)
        .json({ message: "Brak łowiska o podanym identyfikatorze" });
      return;
    }

    const { name, id } = req.params;

    // Ensure collection exists
    const collections = await db.listCollections({ name }).toArray();
    if (collections.length === 0) {
      res
        .status(404)
        .json({ message: "Brak łowiska o podanym identyfikatorze" });
      return;
    }

    // Find the document by id
    const collection = db.collection(name);
    const foundSpot = await collection.findOne({ _id: new ObjectId(id) });

    if (!foundSpot) {
      res
        .status(404)
        .json({ message: "Brak łowiska o podanym identyfikatorze" });
      return;
    }

    res.status(200).json(foundSpot);
  } catch (error) {
    console.error("Błąd podczas wczytywania łowiska", error);
    res.status(500).json({
      message: "Ogólny błąd serwera. Proszę skontaktować się z administratorem",
    });
  }
};

export const createFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const db = await connectDatabase(baseDatabaseName);

  if (!req.body) {
    res
      .status(400)
      .json({ message: 'Brak danych w żądaniu o parametrze "body"' });
    return;
  }

  try {
    const requestBody: FishingSpotProps = req.body;

    const collection = db?.collection(requestBody.area);

    // Check if a spot with the same name or code already exists
    const existingSpot = await collection?.findOne({
      $or: [{ name: requestBody.name }, { code: requestBody.code }],
    });

    if (existingSpot) {
      res.status(409).json({
        message: "Łowisko o podanej nazwie lub kodzie już istnieje",
      });
      return;
    }

    const uploadedData = await collection?.insertOne(requestBody);

    res.status(200).json({ ...requestBody, _id: uploadedData?.insertedId });
  } catch (error) {
    console.error("Wystąpił błąd podczas przesyłania danych:", error);
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
