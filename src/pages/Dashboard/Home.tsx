import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChartThree from '../../components/Charts/ChartThree';
import InfoKatalog from './InfoKatalog';
import DefaultLayout from '../../layout/DefaultLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import exportToCsv from '../../js/exportToCsv';

const Home: React.FC = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState([]);
  const [quantity, setQuantity] = useState({
    box: '',
    bak: '',
    sparepart: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csvData, setcsvData] = useState({ row: [], column: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BACKEND}/api/posts`);
        const responseStats = await axios.get(`${import.meta.env.VITE_API_BACKEND}/api/statistik`);

        setData(response.data);
        setStats(responseStats.data);

        let statsCol = Object.keys(responseStats.data[0]);
        statsCol.forEach((col) => {
          response.data[0][col] = responseStats.data[0][col];
        });

        let column = Object.keys(response.data[0]);
        let row = [];
        response.data.forEach((res) => {
          row.push(Object.values(res));
        });
        setcsvData({ row, column });

        const boxCount = response.data.filter((item) => item.kategori === 'box').length;
        const bakCount = response.data.filter((item) => item.kategori === 'bak').length;
        const sparepartCount = response.data.filter((item) => item.kategori === 'sparepart').length;

        setQuantity({
          box: boxCount,
          bak: bakCount,
          sparepart: sparepartCount
        });
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tombolAksiTemplate = (product) => {
    return (
      <a
        href={`${import.meta.env.VITE_API_CLIENT}/toko/katalog/${product.id}`}
        target="_blank"
        className="bg-green-500 text-sm text-white px-2 py-1 shadow rounded"
      >
        Lihat
      </a>
    );
  };
  const hargaTemplate = (product) => {
    return `Rp${Number(product.harga).toLocaleString('id-ID')}`;
  };
  const header = (
    <div className="flex justify-between gap-2 items-center">
      <span className="text-xl text-900">Terakhir Dilihat</span>
      <button
        className="text-sm bg-blue-800 p-2 text-white rounded"
        onClick={() => exportToCsv('terakhir_dilihat.csv', [csvData.column, ...csvData.row])}
      >
        Download CSV
      </button>
    </div>
  );

  const imageBodyTemplate = (product) => {
    return (
      <img
        src={`${import.meta.env.VITE_API_BACKEND}/image/${
          data.find((d) => d.id == product.id).images[0]
        }`}
        className="w-52 h-52 object-cover object-center rounded shadow-2 border-round"
      />
    );
  };

  const tanggalTemplate = (product) => {
    const date = new Date(product.updated_at);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta',
      timeZoneName: 'short'
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
  };
  return (
    <DefaultLayout>
      <InfoKatalog quantity={quantity} />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartTwo
            data={{
              name: stats.filter((stat) => stat.jumlah_klik).map((stat) => stat.nama),
              series: stats.filter((stat) => stat.jumlah_klik).map((stat) => stat.jumlah_klik)
            }}
          />
        </div>
        <div className="col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <DataTable
              value={stats}
              header={header}
              paginator
              rows={10}
              tableStyle={{ minWidth: '50rem' }}
            >
              <Column
                field="gambar"
                header="Gambar"
                body={imageBodyTemplate}
                className="w-[30%]"
              ></Column>
              <Column field="nama" header="Nama" sortable className="w-[25%]"></Column>
              <Column field="harga" header="Harga" body={hargaTemplate} sortable></Column>
              <Column
                field="jumlah_klik"
                header="Jumlah Klik"
                className="w-[15%]"
                sortable
              ></Column>
              <Column
                field="updated_at"
                header="Dilihat"
                body={tanggalTemplate}
                className="w-[25%]"
                sortable
              ></Column>
              <Column header="Aksi" body={tombolAksiTemplate}></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;
