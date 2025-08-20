import { GenerativeModel, GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import { IEvent, Event } from "../models/eventModel";

// Conceptual example
export class GeminiApiClient {
  private apiKey: string;
  private client: GoogleGenerativeAI
  private model: GenerativeModel

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new GoogleGenerativeAI(this.apiKey);
    this.model = this.client.getGenerativeModel({ 
        model: "gemini-2.5-pro"
    });
}

  public async generateContent(inputData: any, prompt: string, generationConfig: object): Promise<GenerateContentResult> {
    const payload = [prompt, ...inputData]
    
    const result = await this.model.generateContent(payload, generationConfig);
    return result;
  }
}

export class EventsGeminiApiClient extends GeminiApiClient {
  private prompt: string;
  private generationConfig: object;

  constructor(apiKey: string) {
    super(apiKey);

    this.prompt = `
        Extract the text from this Thai performer's schedule image, returning an array. 
        Do not translate the text. 
        Return a json array.
        Each value is a json of this format: {artistName, startDate, endDate, eventName, location, coordinates, time}. 
        If 'ร้าน' is in the event_name, it is also the location. 
        Retrieve lat/lon coordinates by geocoding the location in Thai. 
        Date should be in YYYY-MM-DD format. 
        Time should be in HH:MM format.
        `

    this.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    artist_name: {
                        type: "string",
                    },
                    start_date: {
                        type: "string",
                    },
                    end_date: {
                        type: "string",
                    },
                    event_name: {
                        type: "string",
                    },
                    location: {
                        type: "string",
                    },
                    coordinates: {
                        type: "object",
                        properties: {
                            lat: {
                                type: "number"
                            },
                            lon: {
                                type: "number"
                            },
                        },
                    },
                    time: {
                        type: "string",
                    }
                },
            },
        },
    }

  }

  /**
   * Parses an array of image parts to extract event information using Gemini AI.
   * 
   * @param {object[]} imageParts - array of images or image parts to be processed.
   * @param {string} parsePrompt - prompt to parse images. default is the class prompt.
   * @param {object} genConfig 
   * @returns {Event[]} - Array of Event objects parsed from the image parts
   */
  public async parseImageForEvents(imageParts: object[], adtlPrompt: string = "", parsePrompt: string = this.prompt, genConfig: object = this.generationConfig): Promise<Event[]> {
    const fullPrompt = `${parsePrompt} ${adtlPrompt}`.trim();
    console.log(fullPrompt)
    
    const result = await this.generateContent(imageParts, fullPrompt, genConfig);
    const response = result.response
    if (!response) {
      throw new Error("No response from Gemini API");
    }

    console.log("Gemini API response:", response.text());

    const eventJson = this.extractJsonFromAIOutput(response.text());

    const events = eventJson.map((eventData: object) => {
            return new Event(eventData as IEvent)
    })

    return events;
  }

  /**
   * Converts a file buffer to a generative part for Gemini AI.
   * 
   * @param {Buffer} buffer - The file buffer to convert.
   * @param {string} mimeType - The MIME type of the file (default is "image/jpeg").
   * @returns {object} - The generative part object containing the inline data.
   */
  public fileBufferToGenerativePart(buffer: Buffer, mimeType="image/jpeg"): object{
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        }
    }
}

  public extractJsonFromAIOutput(aiData: string): Object[]{

    var startIndex = 0
    var endIndex = 0
    for(let i=0; i<aiData.length; i++){
        if (aiData[i] == "["){
            startIndex = i
            break
        }
    }
    for(let i=aiData.length-1; i>=0; i--){
        if (aiData[i] == "]"){
            endIndex = i
            break
        }
    }
    // no data
    if(startIndex == endIndex){
        return [];
    }

    const jsonText = aiData.substring(startIndex, endIndex + 1);
    //const jsonText = aiData.trim();

    try {
        const jsonData = JSON.parse(jsonText);
        return jsonData;
    } catch (error) {
        console.error("Error parsing json:", error);
        return [];
    }
  }
}