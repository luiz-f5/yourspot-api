export class CreateSpotDto {
    title!: string;
    description!: string;
    imageBase64?: string;
    latitude!: number;
    longitude!: number;
    location!: string;
  }
  export class UpdateSpotDto {
    title?: string;
    description?: string;
    imageBase64?: string;
    latitude?: number;
    longitude?: number;
    location?: string;
  }
