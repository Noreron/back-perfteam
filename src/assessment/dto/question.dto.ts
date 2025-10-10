import { ApiProperty } from '@nestjs/swagger';

export class QuestionDto {

  @ApiProperty()
  text: string;

  @ApiProperty({ required: false })
  category?: string;
}
