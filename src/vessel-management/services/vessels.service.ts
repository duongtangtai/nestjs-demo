import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MdmVslCntr } from "src/common/entities/MdmVslCntr.entity";
import { RequestService } from "src/common/services/Request.service";
import { ILike, Like, Repository } from "typeorm";
import { SearchVesselsDto } from "../dtos/SearchVessels.dto";
import { response } from "src/utils/ResponseUtils";

@Injectable()
export class VesselsService {
    private logger = new Logger(VesselsService.name)

    constructor(
        @InjectRepository(MdmVslCntr) private vesselRepository: Repository<MdmVslCntr>,
        private requestService: RequestService,
    ) { }

    async getVessels(searchVesselsDto: SearchVesselsDto) {
        try {
            const vesselData = await this.vesselRepository.find({
                where: {
                    vslCd : Like(`${searchVesselsDto.vslCd.toUpperCase()}%`),
                    ...(searchVesselsDto.vslEngNm && {vslEngNm : ILike(`%${searchVesselsDto.vslEngNm}%`)}),
                    ...(searchVesselsDto.crrCd && {crrCd : Like(`${searchVesselsDto.crrCd.toUpperCase()}%`)}),
                    ...(searchVesselsDto.fdrDivCd !== "A" && {fdrDivCd : searchVesselsDto.fdrDivCd}),
                    ...(searchVesselsDto.callSgnNo && {callSgnNo : ILike(`%${searchVesselsDto.callSgnNo}%`)}),
                    ...(searchVesselsDto.lloydNo && {lloydNo : ILike(`%${searchVesselsDto.lloydNo}%`)}),
                    deltFlg : "N",
                },
                order: {
                    vslCd: "ASC"
                }
            })
            return response(vesselData.map(e => {
                const {created_at, created_by, updated_at, updated_by, ...rest} = e
                return {...rest}
            }), HttpStatus.OK);
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}