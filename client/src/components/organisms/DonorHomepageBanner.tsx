import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { Banner } from "../../data/types/donorHomepageConfig"
import BannerCarousel from "../atoms/BannerCarousel";

const DonorHomepageBanner: FunctionComponent = () => {
    const [banner, setBanner] = useState<Banner | undefined>(undefined);

    const query = gql`
        query GetDonorHomepageBanner {
            donorHomepageBanner {
                header
                description
                imagePaths
                interval
            }
        }
    `;

    const { error } = useQuery(query, {
        onCompleted: (data: { donorHomepageBanner: Banner }) => {
            const res = JSON.parse(JSON.stringify(data.donorHomepageBanner));
            const updateBanner = {
                ...res,
                interval: res.interval * 1000
            }
            setBanner(updateBanner);
        }
    });
    if (error) console.log(error.graphQLErrors);

    return (
        <div>
            {banner != undefined && (
                <BannerCarousel {...banner} />   
            )}
        </div>
    );
};

export default DonorHomepageBanner;
