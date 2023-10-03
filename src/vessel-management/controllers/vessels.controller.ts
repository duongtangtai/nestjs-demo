import { Controller } from "@nestjs/common/decorators/core";
import { Body, Get, Param, Query } from "@nestjs/common/decorators/http";
import { SearchVesselsDto } from "../dtos/SearchVessels.dto";
import { VesselsService } from "../services/vessels.service";

@Controller("vessel-management")
export class VesselsController {
    
    constructor(private readonly vesselsService : VesselsService) {
    }

    @Get()
    getVessels(@Query("vslCd") vslCd: string, @Query("vslEngNm") vslEngNm: string, @Query("callSgnNo") callSgnNo: string, @Query("crrCr") crrCr: string, @Query("fdrDivCd") fdrDivCd: string, @Query("lloydNo") lloydNo: string,) {
        console.log("controller...")
        const searchVesselsDto : SearchVesselsDto = {
            vslCd,
            vslEngNm,
            callSgnNo,
            crrCr,
            fdrDivCd,
            lloydNo,
        }
        console.log(searchVesselsDto)
        return this.vesselsService.getVessels(searchVesselsDto)
    }
}