import { Type } from "class-transformer";
import {IsIn, IsInt, IsOptional, Max, Min} from 'class-validator';

export class FindMessagesQueryDto {
    // * Cuantos mensajes devolver (default 50, max 100)
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 50;

    // * Desde cual empezar (default 0)
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number = 0;
}