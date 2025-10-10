import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { ApiOperation, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { QuestionDto } from './dto/question.dto';
import { QuestionResultDto } from './dto/question-result.dto';

@Controller('assessment')
export class AssessmentController {
    constructor(private readonly service: AssessmentService) {}

    @Get('list')
    listSession() {
        return this.service.listSessions();
    }

    @Post('create')
    @ApiOperation({ summary: 'Création d\'un questionnaire' })
    @ApiBody({ type: CreateSessionDto })
    createSession(@Body() dto: CreateSessionDto) {
        return this.service.createSession(dto);
    }

    @Get('questions/:session')
    @ApiOkResponse({ type: [QuestionDto] })
    getQuestions(@Param('session') session: string) {
        return this.service.getQuestions(session);
    }

    @Post('submissions')
    sendUserResult(@Body() dto: QuestionResultDto){
        return this.service.sendUserResult(dto);

    }

    @Get(':session/result')
    getResult(@Param('session') session: string) {
        return this.service.getResults(Number(session));
    }
}