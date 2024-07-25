import { Request, Response } from "express";
import { connectDatabase } from "@config/database";
import { DistrictProps, SpotTypeProps } from "@namespace/dictionaries";
import { ObjectId } from "mongodb";
import { commonMessages } from "@utils/constants";

//Districts dictionary

const baseURL = "dictionaries";

export const getDistrictsDictionaryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseURL);

    if (!db) {
      res.status(404).json({ message: "Brak słownika w bazie danych" });
      return;
    }

    const collection = db.collection<DistrictProps>("districts");

    const districtDictionaries = await collection.find().toArray();

    if (!districtDictionaries?.length) {
      res.status(404).json({ message: "Brak okręgów w słowniku" });
      return;
    }

    res.status(200).json(districtDictionaries);
  } catch (error) {
    console.error("Błąd podczas pobierania słownika okręgów", error);
    res.status(500).json({
      message: "Ogólny błąd serwera. Proszę skontaktować się z administratorem",
    });
  }
};

export const updateDistrictDictionaries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseURL);

    if (!db) {
      res.status(404).json({ message: "Błąd z połączeniem się z bazą danych" });
      return;
    }

    const { id } = req.params;

    const updateData = req.body;

    const collection = db?.collection<DistrictProps>("districts");

    delete updateData._id;

    const fieldId = new ObjectId(id);

    const result = await collection.updateOne(
      { _id: fieldId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        message: `Nie znaleziono słownika o podanych identyfikatorze ${id}`,
      });
      return;
    }

    const updatedSpot = await collection.findOne({ _id: fieldId });

    res.status(200).json(updatedSpot);
  } catch (error) {
    console.error("Error while updating fishing spot:", error);
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

export const createDistrictsDictionaries = async (
  req: Request,
  res: Response
): Promise<void> => {
  const db = await connectDatabase(baseURL);

  if (!req.body) {
    res
      .status(400)
      .json({ message: 'Brak danych w żądaniu o parametrze "body"' });
    return;
  }

  try {
    const requestBody: DistrictProps = req.body;

    const collection = db?.collection<DistrictProps>("districts");

    // Check if a spot with the same name or code already exists
    const existingSpot = await collection?.findOne({
      $or: [{ name: requestBody.name }, { name: requestBody.keyName }],
    });

    if (existingSpot) {
      res.status(409).json({
        message: `Okręg o nazwie "${requestBody.name}" obecnie istnieje`,
      });
      return;
    }

    const uploadedData = await collection?.insertOne(requestBody);

    res.status(200).json({ ...requestBody, _id: uploadedData?.insertedId });
  } catch (error) {
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

//Spots type dictionaries

export const getSpotTypesDictionaryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseURL);

    if (!db) {
      res.status(404).json({ message: "Brak słownika w bazie danych" });
      return;
    }

    const collection = db.collection<SpotTypeProps>("spot-types");

    const districtDictionaries = await collection.find().toArray();

    if (!districtDictionaries?.length) {
      res.status(404).json({ message: "Brak danych w słowniku" });
      return;
    }

    res.status(200).json(districtDictionaries);
  } catch (error) {
    console.error("Błąd podczas pobierania słownika typu łowisk", error);
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

export const updateTypeDictionaryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseURL);

    if (!db) {
      res.status(404).json({ message: "Błąd z połączeniem się z bazą danych" });
      return;
    }

    const { id } = req.params;

    const updateData = req.body;

    const collection = db?.collection<SpotTypeProps>("districts");

    delete updateData._id;

    const fieldId = new ObjectId(id);

    const result = await collection.updateOne(
      { _id: fieldId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        message: `Nie znaleziono słownika o podanych identyfikatorze ${id}`,
      });
      return;
    }

    const updatedSpot = await collection.findOne({ _id: fieldId });

    res.status(200).json(updatedSpot);
  } catch (error) {
    console.error("Error while updating fishing spot:", error);
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

export const createTypeDictionaryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const db = await connectDatabase(baseURL);

  if (!req.body) {
    res
      .status(400)
      .json({ message: 'Brak danych w żądaniu o parametrze "body"' });
    return;
  }

  try {
    const requestBody: SpotTypeProps = req.body;

    const collection = db?.collection<SpotTypeProps>("districts");

    // Check if a spot with the same name or code already exists
    const existingSpot = await collection?.findOne({
      $or: [{ name: requestBody.name }],
    });

    if (existingSpot) {
      res.status(409).json({
        message: `Typ łowiska o nazwie "${requestBody.name}" obecnie istnieje`,
      });
      return;
    }

    const uploadedData = await collection?.insertOne(requestBody);

    res.status(200).json({ ...requestBody, _id: uploadedData?.insertedId });
  } catch (error) {
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};
