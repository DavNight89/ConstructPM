import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsLatitude, IsLongitude } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 40.7128,
  })
  @IsLatitude()
  lat: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -74.0060,
  })
  @IsLongitude()
  lng: number;
}
