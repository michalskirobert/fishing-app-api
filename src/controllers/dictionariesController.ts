import { Request, Response } from "express";
import { connectDatabase } from "@config/database";

import { CollectionInfo } from "mongodb";

export const getSpotsDictionaryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase("spots");

    if (!db) {
      res.status(404).json({ message: "Brak słownika w bazie danych" });
      return;
    }

    const collections: (CollectionInfo | Pick<CollectionInfo, "name">)[] =
      await db.listCollections().toArray();

    const parsedData = collections.map(({ name }, index) => ({
      name,
      id: index,
    }));

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error fetching spots dictionary", error);
    res.status(500).json({
      message: "Ogólny błąd serwera. Proszę skontaktować się z administratorem",
    });
  }
};
