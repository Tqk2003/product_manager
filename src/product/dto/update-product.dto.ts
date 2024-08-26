import { IsCurrency, IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateProductDto {
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    description?: string;

    @IsNotEmpty()
    @IsString()
    category?: string;

    @IsNotEmpty()
    @IsCurrency({
        symbol: '$',
        allow_negatives: false,
        require_symbol: false,
    })
    price?: number;
}
