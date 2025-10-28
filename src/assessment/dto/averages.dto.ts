import { ApiProperty } from '@nestjs/swagger';

export class QuestionAverageDto {
  @ApiProperty({ 
    description: 'Identifiant de la question',
    example: 1 
  })
  questionId: number;

  @ApiProperty({ 
    description: 'Catégorie de la question',
    example: 'Communication' 
  })
  category: string;

  @ApiProperty({ 
    description: 'Moyenne des réponses',
    example: 3.5 
  })
  average: number;
}

export class CategoryAverageDto {
  @ApiProperty({ 
    description: 'Nom de la catégorie',
    example: 'Communication' 
  })
  category: string;

  @ApiProperty({ 
    description: 'Moyenne des réponses pour cette catégorie',
    example: 3.75 
  })
  average: number;
}

export class SessionAveragesDto {
  @ApiProperty({ 
    description: 'Moyennes par question',
    type: [QuestionAverageDto] 
  })
  questionAverages: QuestionAverageDto[];

  @ApiProperty({ 
    description: 'Moyennes par catégorie',
    type: [CategoryAverageDto] 
  })
  categoryAverages: CategoryAverageDto[];
}