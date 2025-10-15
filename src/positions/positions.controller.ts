import { Controller , Get, Post, Put, Delete, Body, Param, UseGuards, Request} from "@nestjs/common";
import { PositionsService } from "./positions.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("positions")
export class PositionsController {
    constructor(private positionsService: PositionsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return this.positionsService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Request() req: any, @Body() body: { position_code: string; position_name: string }
    ) {
        const userId = (req.user as any).userId;
        return this.positionsService.createPositions(body, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":position_id")
    async getOne(@Param("position_id") position_id: string) {
        return this.positionsService.findById(+position_id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(":position_id")
    async update(
        @Param("position_id") position_id: string,
        @Body() body: { position_code?: string; position_name?: string }
    ) {
        return this.positionsService.updatePositions(+position_id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":position_id")
    async remove(@Param("position_id") position_id: string) {
        return this.positionsService.deletePositions(+position_id);
    }
}
