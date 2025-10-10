import { ApiProperty } from '@nestjs/swagger';

export class ResultDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  score: number;

}
