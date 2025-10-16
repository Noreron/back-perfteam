import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { ApiOperation, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { QuestionDto } from './dto/question.dto';
import { QuestionResultDto } from './dto/question-result.dto';
import { CreateAssessmentDto } from './dto/CreateAssessmentDto';
import { SessionDto } from './dto/create-session.dto';
import { dot } from 'node:test/reporters';

@Controller('assessment')
export class AssessmentController {
    constructor(private readonly service: AssessmentService) { }

    @Get('list')
    listAssessment() {
        return this.service.listAssessment();
    }

    @Post('create')
    @ApiOperation({ summary: 'Création d\'un questionnaire' })
    @ApiBody({ type: CreateAssessmentDto })
    createAssessment(@Body() dto: CreateAssessmentDto) {
        return this.service.createAssessment(dto);
    }

    @Post('session')
    @ApiOperation({ summary: "Création d'une session" })
    @ApiBody({ type: SessionDto })
    createSession(@Body() dto: SessionDto) {
        return this.service.createSession(dto);
    }

    @Get('questions/:session')
    @ApiOkResponse({ type: [QuestionDto] })
    getQuestions(@Param('session') session: string) {
        return this.service.getQuestions(session);
    }

    @Post('/submissions')
    @ApiBody({ type: QuestionResultDto })
    sendUserResult(@Param('session') session: string, @Body() dto: QuestionResultDto) {
        if (!dto.sessionSlug) dto.sessionSlug = session;
        return this.service.sendUserResult(dto);

    }

    @Get(':session/result')
    getResult(@Param('session') session: string) {
        return this.service.getResults(Number(session));
    }

    @Get(':session/results/average')
    getAverages(@Param('session') session: string) {
        return this.service.getAveragesByQuestion(session);
    }
}