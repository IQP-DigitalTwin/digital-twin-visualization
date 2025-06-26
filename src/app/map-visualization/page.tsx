import D3Component from '@/components/D3Map';
import { Card } from '@/components/ui/card';

export default async function MapVisualization(){
    return (
        <div className='flex flex-col items-center min-h-screen'>
            <div className='text-4xl font-bold p-5 '>Distribution of Survey Responses</div>
            <Card className='p-10'>
            </Card>
        </div>
    )
}