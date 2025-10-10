import { ApiProperty } from "@nestjs/swagger";
import { QuestionDto } from './question.dto';

export class CreateSessionDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ type: QuestionDto, isArray: true, required: false })
  questions?: QuestionDto[];
}
