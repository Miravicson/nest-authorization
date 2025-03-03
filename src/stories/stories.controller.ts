import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PolicyHandlers } from '../casl/policy-handler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUser } from 'src/auth/types';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @CheckPolicies(PolicyHandlers.CAN_CREATE_STORIES)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @ApiBearerAuth()
  @Post()
  create(
    @Body() createStoryDto: CreateStoryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.storiesService.create(createStoryDto, user.id);
  }

  @Get()
  findAll() {
    return this.storiesService.findAll({});
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.storiesService.findOne({ id });
  }

  @CheckPolicies(PolicyHandlers.CAN_MANAGE_OWN_STORIES)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto) {
    return this.storiesService.update(+id, updateStoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storiesService.remove(+id);
  }
}
