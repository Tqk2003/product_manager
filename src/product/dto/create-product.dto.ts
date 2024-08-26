import { IsCurrency, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    description: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsNotEmpty()
    @IsCurrency({
        symbol: '$',
        allow_negatives: false,
        require_symbol: false,
    })
    price: number;
}
