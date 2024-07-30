import { Request, Response } from "express";
import { connectDatabase } from "@config/database";
import {
  DictionaryProps,
  DistrictProps,
  SpotTypeProps,
} from "@namespace/dictionaries";
import { ObjectId } from "mongodb";
import { commonMessages } from "@utils/constants";
import {
  buildFilterQuery,
  buildSortObject,
  parseQueryFilterArray,
  parseQuerySortingArray,
} from "@utils/functions/table";

//Districts dictionary

const baseURL = "dictionaries";

export const getDictionaries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseURL);

    if (!db) {
      res
        .status(404)
        .json({ message: "Brakuje listy słowników w bazie danych!" });
      return;
    }

    const skip: number = parseInt(req.query.skip as string, 10) || 0;
    const take: number = parseInt(req.query.take as string, 10) || 10;

    // Ensure query parameters are parsed as strings and convert them
    const filters = parseQueryFilterArray(req.query.filters || []);
    const sortings = parseQuerySortingArray(req.query.sortings || []);

    const filterQuery = buildFilterQuery(filters);

    const sortObject = buildSortObject(sortings);

    const collection = db.collection<DictionaryProps>("list");

    const dictionaries = await collection
      .find(filterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(take)
      .toArray();

    res
      .status(200)
      .json({ items: dictionaries, totalItems: dictionaries.length });
  } catch (error) {
    console.error("Błąd podczas pobierania listy słowników", error);
    res.status(500).json({
      message: commonMessages.databaseFailure,
    });
  }
};

export const getDistrictsDictionary = async (
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

export const getDistrictDictionary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseURL);

    if (!db) {
      res.status(404).json({ message: commonMessages.databaseFailure });
      return;
    }

    const { id } = req.params;

    // Find the document by id in the specified collection
    const collection = db.collection<DistrictProps>("districts");
    const foundSpot = await collection.findOne({ _id: new ObjectId(id) });

    if (!foundSpot) {
      res.status(404).json({
        message: `Nie znaleziono podanego słownika`,
      });
      return;
    }

    res.status(200).json(foundSpot);
  } catch (error) {
    res.status(500).json({
      message: commonMessages.commonServerError,
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

export const getSpotTypesDictionary = async (
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

export const getSpotTypeDictionary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseURL);

    if (!db) {
      res.status(404).json({ message: commonMessages.databaseFailure });
      return;
    }

    const { id } = req.params;

    // Find the document by id in the specified collection
    const collection = db.collection<SpotTypeProps>("spots-type");
    const foundSpot = await collection.findOne({ _id: new ObjectId(id) });

    if (!foundSpot) {
      res.status(404).json({
        message: `Nie znaleziono podanego słownika`,
      });
      return;
    }

    res.status(200).json(foundSpot);
  } catch (error) {
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

export const updateSpotTypeDictionary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = await connectDatabase(baseURL);

    if (!db) {
      res.status(404).json({ message: commonMessages.databaseFailure });
      return;
    }

    const { id } = req.params;

    // Find the document by id in the specified collection
    const collection = db.collection<SpotTypeProps>("spots-type");
    const foundSpot = await collection.findOne({ _id: new ObjectId(id) });

    if (!foundSpot) {
      res.status(404).json({
        message: `Nie znaleziono podanego słownika`,
      });
      return;
    }

    res.status(200).json(foundSpot);
  } catch (error) {
    res.status(500).json({
      message: commonMessages.commonServerError,
    });
  }
};

export const createSpotTypeDictionary = async (
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

    const collection = db?.collection<SpotTypeProps>("spot-types");

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
