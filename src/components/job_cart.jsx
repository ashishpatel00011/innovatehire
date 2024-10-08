import { useUser } from '@clerk/clerk-react';
import React, { useState, useEffect, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { MapPinIcon, Trash2Icon, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import useFetch from '@/hooks/use_fatch';
import { saveJob, deleteJob } from '@/api/apijobs';

const Jobcart = memo(({ job, savedInit = false, onJobAction = () => {}, isMyJob = false }) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();
  const { loading: loadingSavedJob, data: savedJob, fn: fnSavedJob } = useFetch(saveJob, {
    alreadySaved: saved
  });
  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  // Save job
  const handleSaveJob = async () => {
    try {
      await fnSavedJob({
        user_id: user.id,
        job_id: job.id,
      });
      setSaved(prevSaved => !prevSaved);
      onJobAction();
      window.location.reload();
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  // Delete job
  const handleDeleteJob = async () => {
    try {
      await fnDeleteJob();
      onJobAction();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <div className="flex justify-between">
          {job.company && <img src={job.company.logo_url} className="h-6" alt={job.company.name} />}
          <div>
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf("."))}.
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});

export default Jobcart;
