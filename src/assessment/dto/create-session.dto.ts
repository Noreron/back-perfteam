import { ApiProperty } from "@nestjs/swagger";



export class SessionDto {
  
  @ApiProperty()
  idAssessment: number;

  @ApiProperty()
  title: string;
}
