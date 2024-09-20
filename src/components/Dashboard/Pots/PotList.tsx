import { usePot } from "@/context/PotContext";
import { Pot } from "@/types";
import Button from "@/ui/Button";
import DropdownMenu from "@/ui/EditOrDeleteDropDownMenu";

interface PotListProps {
  onEditPot: (pot: Pot) => void;
  onDeletePot: (pot: Pot) => void;
  onAddMoney: (pot: Pot) => void;
  onWithdraw: (pot: Pot) => void;
}

const PotList = ({
  onEditPot,
  onDeletePot,
  onAddMoney,
  onWithdraw,
}: PotListProps) => {
  const { pots } = usePot();

  return (
    <div className="grid grid-cols-2 gap-4">
      {pots.map((pot, index) => (
        <div
          key={index}
          className="bg-white w-[518px] h-[303px] flex flex-col gap-y-8 rounded-xl p-6"
        >
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: pot.theme }}
              />
              <h3 className="text-preset-2 text-grey-900 font-bold">
                {pot.name}
              </h3>
            </div>
            <DropdownMenu
              onEdit={() => onEditPot(pot)}
              onDelete={() => onDeletePot(pot)}
              editLabel={"Edit Pot"}
              deleteLabel={"Delete Pot"}
            />
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
              <p className="text-preset-4 text-grey-500">Total Saved</p>
              <p className="text-preset-1 text-grey-900 font-bold">
                ${pot.total.toFixed(2)}
              </p>
            </div>

            <div className="w-full h-2 p-0 bg-beige-100 rounded flex justify-start items-start">
              <div
                className={`self-stretch rounded transition-all duration-1000 ease-in-out`}
                style={{
                  width: `${(pot.total / pot.target) * 100}%`,
                  backgroundColor: pot.theme,
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-preset-5 text-grey-500 font-bold">
                {((pot.total / pot.target) * 100).toFixed(1)}%
              </p>
              <p className="text-preset-5 text-grey-500">
                Target of ${pot.target}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => onAddMoney(pot)}
            >
              + Add Money
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => onWithdraw(pot)}
            >
              Withdraw
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PotList;
