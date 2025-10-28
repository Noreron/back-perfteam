import { ApiProperty } from '@nestjs/swagger';

export class QuestionAnswerDto {
  @ApiProperty()
  questionId: number;

  @ApiProperty()
  value: number;

  @ApiProperty({ required: false })
  comment?: string;
}

export class QuestionResultDto {
  @ApiProperty()
  session: string;

  @ApiProperty({ type: [QuestionAnswerDto] })
  answers: QuestionAnswerDto[];

}
