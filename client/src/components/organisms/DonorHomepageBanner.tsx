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
        onCompleted: (data: { donorHomepage: Banner }) => {
            const res = JSON.parse(JSON.stringify(data.donorHomepage));
            setBanner(res);
            console.log(res);
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
