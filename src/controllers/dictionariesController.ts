import { Request, Response } from "express";
import { connectDatabase } from "@config/database";
import { FishingSpotProps } from "@namespace/fishing-spots";
import { capitalizeFirstLetter } from "@utils/functions";

export const getSpotsDictionaryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase("dictionaries");

    if (!db) {
      res.status(404).json({ message: "Brak słownika w bazie danych" });
      return;
    }

    const collection = db.collection<FishingSpotProps>("spots");

    const areaDictionaries = await collection.find().toArray();

    const processedSpots = areaDictionaries.map((item) => ({
      ...item,
      area: capitalizeFirstLetter(item?.area),
    }));

    if (!processedSpots?.length) {
      res.status(404).json({ message: "Brak okręgów w słowniku" });
      return;
    }

    res.status(200).json(processedSpots);
  } catch (error) {
    console.error("Błąd podczas pobierania słownika okręgów", error);
    res.status(500).json({
      message: "Ogólny błąd serwera. Proszę skontaktować się z administratorem",
    });
  }
};
