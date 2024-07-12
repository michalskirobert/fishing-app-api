import { Request, Response } from "express";
import { connectDatabase } from "@config/database";

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

    const collection = db.collection("spots");

    const spots = await collection.find().toArray();

    if (spots.length === 0) {
      res.status(404).json({ message: "Brak okręgów w słowniku" });
      return;
    }

    res.status(200).json(spots);
  } catch (error) {
    console.error("Błąd podczas pobierania słownika okręgów", error);
    res.status(500).json({
      message: "Ogólny błąd serwera. Proszę skontaktować się z administratorem",
    });
  }
};
