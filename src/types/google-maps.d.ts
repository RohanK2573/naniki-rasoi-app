declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: any);
    }

    class Marker {
      constructor(opts?: any);
    }

    namespace places {
      class AutocompleteService {
        constructor();
        getPlacePredictions(
          request: any,
          callback: (predictions: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
        ): void;
      }

      class PlacesService {
        constructor(attrContainer: Map | HTMLElement);
        getDetails(
          request: any,
          callback: (place: any | null, status: PlacesServiceStatus) => void
        ): void;
      }

      interface AutocompletePrediction {
        place_id: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
      }

      enum PlacesServiceStatus {
        OK = 'OK'
      }
    }
  }
}

declare const google: typeof google;