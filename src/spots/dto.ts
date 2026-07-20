export class CreateSpotDto {
    title!: string;
    description!: string;
    image?: Buffer;
    latitude!: number;
    longitude!: number;
    location!: string;
  }
  
  export class UpdateSpotDto {
    title?: string;
    description?: string;
    image?: Buffer;
    latitude?: number;
    longitude?: number;
    location?: string;
  }
  