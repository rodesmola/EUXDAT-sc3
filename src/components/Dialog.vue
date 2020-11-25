<template>

    <v-flex xs12  class="pa-3" style=" text-align: justify; ">
        <div style="margin-bottom: 15px">
            <img style="width: 160px; position: absolute; opacity: 0.2; bottom: 70px; right: 5px;" src="../assets/logo2.png" alt="">
            <span class="title" style="color: #1e2f4d;">Delimiting Agro-climatic zones scenario</span>
        </div>

        <p>
            Today, the maps of climate zones are very generic: they usually show large areas and are 
            static for a particular area of interest.
        </p>
        <p>
            The Agro-climatic classification system will allow the delimiting of land areas in agro-climatic 
            classes based on long-term weather data. It will allow the establishment of factors such as: 
        </p>
        <p>
            <ul>
            <li>Frost (Date of last spring frost, date of first fall frost, the average length of f
                rost-free season, frost-free period).</li>
            <li>Days for fall nitrogen application for a given site /area.</li>
            <li>Solar radiation for a given site /area.</li>
            <li>Growing degree days: average /minimum /maximum growing degree days 
                (base 0°C, 3°C, 5°C, 8°C, 10°C, 15°C) for a given site /area.</li>
            <li>Heat stress units for C3/C4 crops for a given site /area.</li>
            <li>The number of days with (optimum) growing temperatures for C3/C4 crops for a given site /area.</li>
            </ul>
        </p>
        <p style="margin-bottom: 15px;">
            Delimiting such zones could help for example in choosing a plant or fertilization date, 
            which is a contribution to the Plant Growth Stage Monitoring scenario, for choosing the 
            appropriate date of planting crops and so on.
        </p>
        <p>
            <span class="title" style="color: #37aa48; font-size 12px;">
            Specifications
            </span>
        </p>
        <p>This interface you are about to see is dedicated to <strong> Dates agro-climatic factor </strong> 
            (date of last spring frost, date of first fall frost, the average length of frost-free season) 
            for the chosen area of  the Czech Republic containing data for calculation of such a factor for 
            period from 1982 to 2019.
        </p>

        <p>
            <strong>How to use this Graphical User Interface is described in detail 
            <a target="_blank" href="http://nextcloud.test.euxdat.eu/s/677RJmBEq8B26jx">here</a>
            </strong> (after logging in).
        </p>
        <p>
            <span class="title" style="color: #37aa48; font-size 12px;">
            Description of the algorithm used
            </span>
        </p>
        <p>
            The minimum daily temperatures are a necessary variable for determining frost dates. The daily minimum 
            is determined to be the lowest value of the hourly temperatures each day. The algorithm allows us to 
            request more hours of frost per day to mark a day as the day of frost if we are only interested in 
            more hours of frost daily (one hour of frost is negligible for us). We search for the days where 
            the minimum is below 0°C. Subsequently, the algorithm calculates the last freezing day of each year 
            for the spring period and the first freezing day for the autumn period. The spring period is set as six 
            months from the coldest month, the autumn period as 6 months before the coldest month. For the sake of 
            simplicity, the coldest month is designated as January for the northern hemisphere and July for the 
            southern hemisphere, which is the central month of the meteorologist winter season.
        </p>
        <p>
            The hemisphere is determined by latitude. The resulting last spring frost date and first autumn frost date are 
            calculated from the annual frost dates with a corresponding probability. The frost-free period is calculated 
            as the period between the last and the first frost date.
        </p>       
        <p>
            There are also occasional frosts in summer in some areas, therefore, by altering the input parameters, it is 
            possible to calculate more first/last days of frost in a row as the last/first frost date. The last/first frost 
            date with defined probability is calculated from all selected years using the normal distribution. Standard deviation 
            and mean for the normal distribution is calculated from the frost dates of each year. Frost-free period with 
            defined probability is calculated as the difference between these last/first frost dates.
        </p>   
        <p>
            <span class="title" style="color: #37aa48; font-size 12px;">
            Description of output
            </span>
        </p>
        <p>
            The output of the algorithm can be downloaded as a geojson file containing the following attributes: 
            (<span style="font-style: italic;">“yyyy”</span> is the chosen year, <span style="font-style: italic;">“nn”</span> is the chosen probability)
        </p>  
        <p>
            <ul>
                <li>[First<span style="font-style: italic;">Dyyyy</span>] = first frost date of each year (date)</li>
                <li>[Last<span style="font-style: italic;">Dyyyy</span>] = last frost date of each year (date)</li>
                <li>[Period<span style="font-style: italic;">yyyy</span>] = frost-free period of each year (integer in days)</li>
                <li>[FrDays<span style="font-style: italic;">yyyy</span>] = number of frost days of each year (integer in days)</li>
                <li>[FirstD<span style="font-style: italic;">nn</span>] = first frost date with a defined probability (integer in days)</li>
                <li>[LastD<span style="font-style: italic;">nn</span>] = last frost date with a defined probability (date)</li>
                <li>[Period<span style="font-style: italic;">nn</span>] = frost-free season with a defined probability (integer, days)</li>
                <li>[AvgFrDays] = average number of frost days for the chosen period (integer in days)</li>
            </ul>
        </p>
        <p>
            <span class="title" style="color: #37aa48; font-size 12px;">
            Description of output
            </span>
        </p>    
        <p>
            The rest of the agro-climatic factors mentioned above can be found in the <strong>public/shared</strong> folder of Jupyter Notebook 
            Prototyping environment within the EUXDAT e-infrastructure – see the part TOOLS & APPLICATIONS at test.euxdat.eu.
        </p>             
    </v-flex>

</template>

<script>
export default {
  name: "Dialog",
  props: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>