// import { Controller, Post, Param } from '@nestjs/common';
// import { StopwatchService } from './stopwatch.service';

// @Controller('stopwatches')
// export class StopwatchController {
//   constructor(private readonly stopwatchService: StopwatchService) {}

//   @Post(':userId/start/:targetSeconds')
//   async startStopwatch(
//     @Param('userId') userId: number,
//     @Param('targetSeconds') targetSeconds: number,
//   ) {
//     return this.stopwatchService.createStopwatch(userId, targetSeconds);
//   }

//   @Post(':stopwatchId/end')
//   async endStopwatch(@Param('stopwatchId') stopwatchId: number) {
//     return this.stopwatchService.endStopwatch(stopwatchId);
//   }
// }
