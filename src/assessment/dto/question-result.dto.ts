import { ApiProperty } from '@nestjs/swagger';
import { ResultDto } from './result.dto';

export class QuestionResultDto {

  @ApiProperty()
  session: string;

  @ApiProperty({ type: ResultDto, isArray: true})
  answers: ResultDto[];
}
