import GetLocation from "@/app/components/GeoLocation";

export default function Contact(){
    return(
<div className="flex flex-col justify-center items-center gap-4 bg-gray-200 p-10 m-4">
    <h1 className="font-medium text-3xl"> Contact page </h1>
    
    <p className="font-mono text-2xl">Coming soon</p>
    <GetLocation/>
</div>
    );
}